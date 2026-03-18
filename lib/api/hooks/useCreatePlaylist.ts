import { useMutation } from '@apollo/client';
import { CREATE_PLAYLIST } from '../mutations';
import { CreatePlaylistInput, Playlist } from '../types';

export function useCreatePlaylist() {
  const [createPlaylistMutation, { data, loading, error }] = useMutation<{
    createPlaylist: Playlist;
  }, {
    input: CreatePlaylistInput;
  }>(CREATE_PLAYLIST);

  const createPlaylist = async (input: CreatePlaylistInput) => {
    try {
      console.log('CreatePlaylist Variables:', JSON.stringify(input, null, 2));
      const result = await createPlaylistMutation({
        variables: {
          input,
        },
      });
      return result.data?.createPlaylist;
    } catch (err) {
      console.error('Error creating playlist:', err);
      throw err;
    }
  };

  return {
    createPlaylist,
    playlist: data?.createPlaylist,
    loading,
    error,
  };
}
