import { Map } from 'immutable';
import { resolvePath } from 'Lib/pathHelper';
import { ADD_ASSET, REMOVE_ASSET } from 'Actions/media';
import AssetProxy from 'ValueObjects/AssetProxy';

const medias = (state = Map(), action) => {
  switch (action.type) {
    case ADD_ASSET:
      return state.set(action.payload.public_path, action.payload);
    case REMOVE_ASSET:
      return state.delete(action.payload);

    default:
      return state;
  }
};

export default medias;

const memoizedProxies = {};
export const getAsset = (publicFolder, builtFolder, state, path) => {
  // No path provided, skip
  if (!path) return null;
  let value;
    if (builtFolder && builtFolder[0] === '/' && path.indexOf(publicFolder) === 0) {
        value = `${builtFolder}${path.indexOf('/') === -1 ? '/' : ''}${path.substring(publicFolder.length)}`
    } else {
        value = resolvePath(path, builtFolder);
    }

  let proxy = state.get(path) || memoizedProxies[path];
  if (proxy) {
    // There is already an AssetProxy in memmory for this path. Use it.
    return proxy;
  }

  // Create a new AssetProxy (for consistency) and return it.
  proxy = memoizedProxies[path] = new AssetProxy(value, null, true);
  return proxy;
};
