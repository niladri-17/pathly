export const QUEUES = {
  OTP: 'OTP_QUEUE',
  NOTIFICATION: 'NOTIFICATION_QUEUE',
} as const;

export const PATTERNS = {
  AUTH_REQUEST_OTP: 'auth.requestOtp',
  AUTH_VERIFY_OTP: 'auth.verifyOtp',
  NOTIFY_SEND_OTP: 'notify.sendOtp', // event key (optional naming)
} as const;
