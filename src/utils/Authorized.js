import RenderAuthorize from '@/components/Authorized';
import { getAuthority } from './authority';
/* eslint-disable eslint-comments/disable-enable-pair */

/* eslint-disable import/no-mutable-exports */

// 这里使用了函数柯里化， 在一个函数里面return一个函数；
let Authorized = RenderAuthorize(getAuthority()); // Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorize(getAuthority());
};

export { reloadAuthorized };
export default Authorized;
