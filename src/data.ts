import { Album, Artist, Favourites, Track, User } from './interfaces';

export const data = {
  users: <User[]>[],
  artists: <Artist[]>[],
  tracks: <Track[]>[],
  albums: <Album[]>[],
  favourites: <Favourites>{
    artists: <string[]>[],
    albums: <string[]>[],
    tracks: <string[]>[]
  },
};
