import { useMutation, useQuery } from '@apollo/client';
import { useQueryClient } from '@tanstack/react-query';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { ADD_PARENTAL_CONTROL, REMOVE_PARENTAL_CONTROL, RENAME_PLAYLIST_CATEGORY } from '../mutations';
import { GET_PARENTAL_CONTROLS } from '../queries';
import { 
  CreateParentalControlInput, 
  GetParentalControlsResponse, 
  QueryParentalControlInput,
  RemoveParentalControlInput,
  RenameCategoryInput,
  RenameCategoryResponse
} from '../types';

/**
 * Hook to manage parental controls: fetching, adding, and removing.
 */
export function useParentalControls() {
  const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);
  const queryClient = useQueryClient();

  /**
   * Fetch parental controls with optional filters and skip logic.
   */
  const useGetParentalControls = (filters: Partial<QueryParentalControlInput> = {}, options: { skip?: boolean } = {}) => {
    return useQuery<GetParentalControlsResponse>(GET_PARENTAL_CONTROLS, {
      variables: {
        filters: {
          playlistId: activePlaylistId || '',
          page: 1,
          limit: 50,
          ...filters,
        },
      },
      skip: !activePlaylistId || options.skip,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    });
  };

  /**
   * Add an item to parental controls.
   */
  const [addParentalControlMutation, { loading: isAdding }] = useMutation(ADD_PARENTAL_CONTROL, {
    refetchQueries: [GET_PARENTAL_CONTROLS],
  });

  /**
   * Remove an item from parental controls.
   */
  const [removeParentalControlMutation, { loading: isRemoving }] = useMutation(REMOVE_PARENTAL_CONTROL, {
    refetchQueries: [GET_PARENTAL_CONTROLS],
  });

  /**
   * Rename a category.
   */
  const [renameCategoryMutation, { loading: isRenaming }] = useMutation<RenameCategoryResponse, { input: RenameCategoryInput }>(RENAME_PLAYLIST_CATEGORY);

  const addParentalControl = async (input: Omit<CreateParentalControlInput, 'playlistId'> & { playlistId?: string }) => {
    const playlistId = input.playlistId || activePlaylistId;
    
    if (!playlistId) {
      throw new Error('No active playlist selected');
    }

    const result = await addParentalControlMutation({
      variables: {
        input: {
          ...input,
          playlistId,
        },
      },
    });

    // Invalidate ONLY the relevant REST categories list
    queryClient.invalidateQueries({ queryKey: ['playlist-categories', playlistId, input.type] });

    return result;
  };

  const removeParentalControl = async (input: Omit<RemoveParentalControlInput, 'playlistId'> & { playlistId?: string }) => {
    const playlistId = input.playlistId || activePlaylistId;
    
    if (!playlistId) {
      throw new Error('No active playlist selected');
    }

    const result = await removeParentalControlMutation({
      variables: {
        input: {
          ...input,
          playlistId,
        },
      },
    });

    // Invalidate ONLY the relevant REST categories list
    queryClient.invalidateQueries({ queryKey: ['playlist-categories', playlistId, input.type] });

    return result;
  };

  const renamePlaylistCategory = async (input: Omit<RenameCategoryInput, 'playlistId'> & { playlistId?: string }) => {
    const playlistId = input.playlistId || activePlaylistId;
    
    if (!playlistId) {
      throw new Error('No active playlist selected');
    }

    const result = await renameCategoryMutation({
      variables: {
        input: {
          ...input,
          playlistId,
        },
      },
    });

    // Invalidate the REST categories list to reflect the rename
    queryClient.invalidateQueries({ queryKey: ['playlist-categories', playlistId, input.contentType] });

    return result;
  };

  return {
    useGetParentalControls,
    addParentalControl,
    removeParentalControl,
    renamePlaylistCategory,
    isAdding,
    isRemoving,
    isRenaming,
  };
}
