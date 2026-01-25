import { create } from 'zustand';

const useSidebarStore = create((set) => ({
    activeTab: 'Home',
    setActiveTab: (tab) => set({ activeTab: tab }),
}));

export default useSidebarStore;
