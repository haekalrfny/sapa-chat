// npm
import { create } from "zustand";
// firebase
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;
    // check if current user is blocked
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId: chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId: chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId: chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },
}));
