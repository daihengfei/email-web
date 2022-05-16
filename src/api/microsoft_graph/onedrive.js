import { get } from "@/utils/request"

export function getFileList(accessToken, path) {
  return get(`https://graph.microsoft.com/v1.0/me/drive/root/${path}/children`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export function getFileContent(accessToken, path) {
  return get(`https://graph.microsoft.com/v1.0/me/drive/root/${path}/content`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export function getFileThumbnail(accessToken, path) {
  return get(`https://graph.microsoft.com/v1.0/me/drive/root/${path}/thumbnails/0/medium`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export function getFilePreview(accessToken, path) {
  return get(`https://graph.microsoft.com/v1.0/me/drive/root/${path}/preview`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export function getFilePermission(accessToken, path) {
  return get(`https://graph.microsoft.com/v1.0/me/drive/root/${path}/permissions`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export function getFileInfo(accessToken, path) {
  return get(`https://graph.microsoft.com/v1.0/me/drive/root/${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}
