import { useMutation, useQuery } from '@apollo/client';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../mutations';
import { GET_FAVORITES } from '../queries';
import { 
  CreateFavoriteInput, 
  GetFavoritesResponse, 
  QueryFavoriteInput 
} from '../types';

/**
 * Hook to manage favorites: fetching, adding, and removing.
 */
export function useFavorites() {
  const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);

  /**
   * Fetch favorites with optional filters.
   */
  const useGetFavorites = (filters: Partial<QueryFavoriteInput> = {}) => {
    return useQuery<GetFavoritesResponse>(GET_FAVORITES, {
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
   * Add an item to favorites.
   */
  const [addFavoriteMutation, { loading: isAdding }] = useMutation(ADD_FAVORITE, {
    refetchQueries: [GET_FAVORITES],
  });

  /**
   * Remove an item from favorites.
   */
  const [removeFavoriteMutation, { loading: isRemoving }] = useMutation(REMOVE_FAVORITE, {
    refetchQueries: [GET_FAVORITES],
  });

  const addFavorite = async (input: Omit<CreateFavoriteInput, 'playlistId'> & { playlistId?: string }) => {
    const playlistId = input.playlistId || activePlaylistId;
    
    if (!playlistId) {
      throw new Error('No active playlist selected');
    }

    return addFavoriteMutation({
      variables: {
        input: {
          ...input,
          playlistId,
        },
      },
    });
  };

  const removeFavorite = async (id: string) => {
    if (!id) {
      throw new Error('No favorite ID provided for removal');
    }

    return removeFavoriteMutation({
      variables: {
        removeFavoriteId: id,
      },
    });
  };

  return {
    useGetFavorites,
    addFavorite,
    removeFavorite,
    isAdding,
    isRemoving,
  };
}
