import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token';
const refreshTokenKey = 'refreshToken';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(refreshTokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)

}export function setRefreshToken(refreshToken) {
  return Cookies.set(refreshTokenKey,refreshToken)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(refreshTokenKey)
}
