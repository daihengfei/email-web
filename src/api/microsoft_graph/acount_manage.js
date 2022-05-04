import { get, post } from '@/utils/request';

export function getAccountList(data) {
  return get('/microsoft_graph/client_list', data);
}

export function createAccount(data) {
  return post('/microsoft_graph/add_client', data);
}
