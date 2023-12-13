import { ElMessage } from 'element-plus';

export function showMessage(message, messageType, onCloseCallback) {
  ElMessage({
    message: message,
    type: messageType,
    onClose: onCloseCallback, // 动态传入回调函数
  });
}
