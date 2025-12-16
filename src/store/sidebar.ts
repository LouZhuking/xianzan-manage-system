import { defineStore } from 'pinia';

// 设备信息接口
export interface DeviceInfo {
	id: string;
	name: string;
	status: 'online' | 'offline' | 'fault';
}

// 供应商信息接口
export interface SupplierInfo {
	id: string;
	name: string;
	badge: string | null;
	devices?: DeviceInfo[];
}

export const useSidebarStore = defineStore('sidebar', {
	state: () => {
		return {
			collapse: false,
			bgColor: localStorage.getItem('sidebar-bg-color') || '#324157',
			textColor: localStorage.getItem('sidebar-text-color') || '#bfcbd9',
			// 当前选中的供应商
			activeSupplier: null as { index: number; name: string } | null,
			// 当前选中的设备（供应商视图）
			activeDevice: null as { index: number; id: string; name: string } | null,
			// 当前登录用户的供应商信息（非管理员时使用）
			currentSupplierInfo: null as SupplierInfo | null
		};
	},
	getters: {
		// 判断是否为管理员
		isAdmin(): boolean {
			const username = localStorage.getItem('vuems_name');
			return username === 'admin';
		},
		// 获取当前供应商的设备列表
		deviceList(): DeviceInfo[] {
			return this.currentSupplierInfo?.devices || [];
		}
	},
	actions: {
		handleCollapse() {
			this.collapse = !this.collapse;
		},
		setBgColor(color: string) {
			this.bgColor = color;
			localStorage.setItem('sidebar-bg-color', color);
		},
		setTextColor(color: string) {
			this.textColor = color;
			localStorage.setItem('sidebar-text-color', color);
		},
		setActiveSupplier(index: number, name: string) {
			this.activeSupplier = { index, name };
		},
		// 设置当前选中的设备
		setActiveDevice(index: number, id: string, name: string) {
			this.activeDevice = { index, id, name };
		},
		// 设置当前供应商信息（登录时调用）
		setCurrentSupplierInfo(supplier: SupplierInfo | null) {
			this.currentSupplierInfo = supplier;
			// 重置选中状态
			this.activeDevice = null;
		},
		// 清除供应商信息（登出时调用）
		clearSupplierInfo() {
			this.currentSupplierInfo = null;
			this.activeDevice = null;
		}
	}
});
