const fs = require('fs');
const path = require('path');
const {
  AndroidConfig,
  withAndroidManifest,
  withDangerousMod,
} = require('expo/config-plugins');

const MODULE_NAME = 'MacAddressModule';
const PACKAGE_NAME = 'MacAddressPackage';

const moduleSource = (androidPackage) => `package ${androidPackage}

import android.content.Context
import android.net.wifi.WifiManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.net.NetworkInterface
import java.util.Collections
import java.util.Locale

class ${MODULE_NAME}(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "${MODULE_NAME}"

  @ReactMethod
  fun getMacAddress(promise: Promise) {
    try {
      promise.resolve(resolveMacAddress() ?: "NOT_AVAILABLE")
    } catch (error: Exception) {
      promise.reject("MAC_ADDRESS_ERROR", error)
    }
  }

  private fun resolveMacAddress(): String? {
    val preferredInterfaces = listOf("eth0", "wlan0", "wifi0", "lan0")

    preferredInterfaces.forEach { interfaceName ->
      getMacFromInterface(interfaceName)?.let { return it }
    }

    preferredInterfaces.forEach { interfaceName ->
      getMacFromSystemFile(interfaceName)?.let { return it }
    }

    getMacFromWifiManager()?.let { return it }
    return getFirstValidNetworkInterfaceMac()
  }

  private fun getMacFromInterface(interfaceName: String): String? {
    return try {
      val networkInterface = NetworkInterface.getByName(interfaceName) ?: return null
      formatMacAddress(networkInterface.hardwareAddress)
    } catch (_: Exception) {
      null
    }
  }

  private fun getFirstValidNetworkInterfaceMac(): String? {
    return try {
      Collections.list(NetworkInterface.getNetworkInterfaces())
        .filter { !it.isLoopback && !it.isVirtual }
        .mapNotNull { formatMacAddress(it.hardwareAddress) }
        .firstOrNull()
    } catch (_: Exception) {
      null
    }
  }

  private fun getMacFromSystemFile(interfaceName: String): String? {
    return try {
      val mac = File("/sys/class/net/$interfaceName/address")
        .takeIf { it.exists() && it.canRead() }
        ?.readText()
        ?.trim()

      normalizeMacAddress(mac)
    } catch (_: Exception) {
      null
    }
  }

  @Suppress("DEPRECATION")
  private fun getMacFromWifiManager(): String? {
    return try {
      val wifiManager = reactContext.applicationContext
        .getSystemService(Context.WIFI_SERVICE) as? WifiManager

      normalizeMacAddress(wifiManager?.connectionInfo?.macAddress)
    } catch (_: Exception) {
      null
    }
  }

  private fun formatMacAddress(macBytes: ByteArray?): String? {
    if (macBytes == null || macBytes.isEmpty()) return null

    val mac = macBytes.joinToString(":") { byte ->
      String.format(Locale.US, "%02X", byte)
    }

    return normalizeMacAddress(mac)
  }

  private fun normalizeMacAddress(macAddress: String?): String? {
    val normalized = macAddress
      ?.trim()
      ?.uppercase(Locale.US)
      ?: return null

    if (!MAC_ADDRESS_PATTERN.matches(normalized)) return null
    if (normalized in INVALID_MAC_ADDRESSES) return null

    return normalized
  }

  companion object {
    private val MAC_ADDRESS_PATTERN = Regex("^([0-9A-F]{2}:){5}[0-9A-F]{2}$")
    private val INVALID_MAC_ADDRESSES = setOf(
      "00:00:00:00:00:00",
      "02:00:00:00:00:00",
      "FF:FF:FF:FF:FF:FF"
    )
  }
}
`;

const packageSource = (androidPackage) => `package ${androidPackage}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class ${PACKAGE_NAME} : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(${MODULE_NAME}(reactContext))
  }

  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}
`;

function addAndroidPermission(androidManifest, permissionName) {
  const manifest = androidManifest.manifest;
  const permissions = manifest['uses-permission'] || [];
  const exists = permissions.some(
    (permission) => permission.$['android:name'] === permissionName
  );

  if (!exists) {
    permissions.push({ $: { 'android:name': permissionName } });
    manifest['uses-permission'] = permissions;
  }

  return androidManifest;
}

function registerMacAddressPackage(mainApplicationSource) {
  if (mainApplicationSource.includes(`add(${PACKAGE_NAME}())`)) {
    return mainApplicationSource;
  }

  if (mainApplicationSource.includes('// add(MyReactNativePackage())')) {
    return mainApplicationSource.replace(
      '// add(MyReactNativePackage())',
      `// add(MyReactNativePackage())\n              add(${PACKAGE_NAME}())`
    );
  }

  return mainApplicationSource.replace(
    'PackageList(this).packages.apply {',
    `PackageList(this).packages.apply {\n              add(${PACKAGE_NAME}())`
  );
}

function writeMacAddressModule(androidRoot, androidPackage) {
  const packageDir = path.join(
    androidRoot,
    'app/src/main/java',
    ...androidPackage.split('.')
  );

  fs.mkdirSync(packageDir, { recursive: true });
  fs.writeFileSync(path.join(packageDir, `${MODULE_NAME}.kt`), moduleSource(androidPackage));
  fs.writeFileSync(path.join(packageDir, `${PACKAGE_NAME}.kt`), packageSource(androidPackage));

  const mainApplicationPath = path.join(packageDir, 'MainApplication.kt');
  if (!fs.existsSync(mainApplicationPath)) return;

  const mainApplicationSource = fs.readFileSync(mainApplicationPath, 'utf8');
  fs.writeFileSync(
    mainApplicationPath,
    registerMacAddressPackage(mainApplicationSource)
  );
}

module.exports = function withAndroidMacAddressModule(config) {
  config = withAndroidManifest(config, (androidManifestConfig) => {
    androidManifestConfig.modResults = addAndroidPermission(
      androidManifestConfig.modResults,
      'android.permission.ACCESS_WIFI_STATE'
    );

    return androidManifestConfig;
  });

  return withDangerousMod(config, [
    'android',
    async (dangerousModConfig) => {
      const androidPackage = AndroidConfig.Package.getPackage(dangerousModConfig);
      writeMacAddressModule(
        dangerousModConfig.modRequest.platformProjectRoot,
        androidPackage
      );

      return dangerousModConfig;
    },
  ]);
};
