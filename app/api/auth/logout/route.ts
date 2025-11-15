import { createLogoutResponse } from '@/app/util/session';

export async function POST() {
  return createLogoutResponse();
}
