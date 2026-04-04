import { useMutation, useQuery } from '@apollo/client';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { ADD_PARENTAL_CONTROL, REMOVE_PARENTAL_CONTROL } from '../mutations';
import { GET_PARENTAL_CONTROLS } from '../queries';
import { 
  CreateParentalControlInput, 
  GetParentalControlsResponse, 
  QueryParentalControlInput 
} from '../types';

/**
 * Hook to manage parental controls: fetching, adding, and removing.
 */
export function useParentalControls() {
  const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);

  /**
   * Fetch parental controls with optional filters.
   */
  const useGetParentalControls = (filters: Partial<QueryParentalControlInput> = {}) => {
    return useQuery<GetParentalControlsResponse>(GET_PARENTAL_CONTROLS, {
      variables: {
        filters: {
          playlistId: activePlaylistId || '',
          page: 1,
          limit: 50,
          ...filters,
        },
      },
      skip: !activePlaylistId,
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

  const addParentalControl = async (input: Omit<CreateParentalControlInput, 'playlistId'> & { playlistId?: string }) => {
    const playlistId = input.playlistId || activePlaylistId;
    
    if (!playlistId) {
      throw new Error('No active playlist selected');
    }

    return addParentalControlMutation({
      variables: {
        input: {
          ...input,
          playlistId,
        },
      },
    });
  };

  const removeParentalControl = async (id: string) => {
    if (!id) {
      throw new Error('No parental control ID provided for removal');
    }

    return removeParentalControlMutation({
      variables: {
        removeParentalControlId: id,
      },
    });
  };

  return {
    useGetParentalControls,
    addParentalControl,
    removeParentalControl,
    isAdding,
    isRemoving,
  };
}
