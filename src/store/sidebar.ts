import { defineStore } from 'pinia';
import { getDealerDeviceList, type DealerItem, type DeviceItem } from '@/api/index';

// 设备信息接口（用于组件展示）
export interface DeviceInfo {
	id: string;
	name: string;
	status: 'online' | 'offline' | 'fault';
	deviceCode: string;
	dealerId: number;
}

// 供应商信息接口（用于组件展示）
export interface SupplierInfo {
	id: number;
	name: string;
	badge: string | null;
	devices?: DeviceInfo[];
}

// 将后端设备状态映射为前端状态
const mapDeviceStatus = (status: string): 'online' | 'offline' | 'fault' => {
	switch (status) {
		case '运行中':
			return 'online';
		case '离线':
			return 'offline';
		case '故障':
			return 'fault';
		default:
			return 'offline';
	}
};

// 将后端数据转换为前端格式
const transformDealerData = (dealer: DealerItem): SupplierInfo => {
	return {
		id: dealer.id,
		name: dealer.dealerName,
		badge: dealer.deviceList.length > 0 ? String(dealer.deviceList.length) : null,
		devices: dealer.deviceList.map((device: DeviceItem) => ({
			id: String(device.id),
			name: device.deviceName,
			status: mapDeviceStatus(device.deviceStatus),
			deviceCode: device.deviceCode,
			dealerId: device.dealerId
		}))
	};
};

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
			currentSupplierInfo: null as SupplierInfo | null,
			// 供应商列表（管理员视图使用）
			supplierList: [] as SupplierInfo[],
			// 数据加载状态
			loading: false
		};
	},
	getters: {
		// 判断是否为管理员（基于roleId判断）
		isAdmin(): boolean {
			const roleId = localStorage.getItem('vuems_roleId');
			return roleId === '1';
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
			this.supplierList = [];
		},
		// 从API获取供应商设备列表
		async fetchDealerDeviceList() {
			this.loading = true;
			try {
				// 获取当前登录用户名
				const username = localStorage.getItem('vuems_name') || 'admin';
				
				console.log('当前用户:', username);
				
				// user参数是必填的，传递当前登录用户名
				const res = await getDealerDeviceList(username);
				
				console.log('API响应:', res);
				
				if (res.code === 200 && res.data) {
					// 转换数据格式
					this.supplierList = res.data.map(transformDealerData);
					console.log('转换后的供应商列表:', this.supplierList);
					return this.supplierList;
				}
				return [];
			} catch (error) {
				console.error('获取供应商设备列表失败:', error);
				return [];
			} finally {
				this.loading = false;
			}
		}
	}
});
