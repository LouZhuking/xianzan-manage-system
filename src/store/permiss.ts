import { defineStore } from 'pinia';

interface ObjectList {
    [key: string]: string[];
}

// 用户角色类型
export type UserRole = 'admin' | 'supplier' | 'user';

export const usePermissStore = defineStore('permiss', {
    state: () => {
        const defaultList: ObjectList = {
            admin: [
                '0',
                '1',
                '11',
                '12',
                '13',
                '2',
                '21',
                '22',
                '23',
                '24',
                '25',
                '26',
                '27',
                '28',
                '29',
                '291',
                '292',
                '3',
                '31',
                '32',
                '33',
                '34',
                '4',
                '41',
                '42',
                '5',
                '7',
                '6',
                '61',
                '62',
                '63',
                '64',
                '65',
                '66',
            ],
            // 供应商权限（可以查看设备管理、营收流水、订单系统等）
            supplier: ['0', '1', '11'],
            user: ['0', '1', '11', '12', '13'],
        };
        const username = localStorage.getItem('vuems_name');
        const userRole = localStorage.getItem('vuems_role') as UserRole || 'user';
        console.log(username, userRole);
        return {
            key: (username == 'admin' ? defaultList.admin : defaultList[userRole] || defaultList.user) as string[],
            defaultList,
            // 当前用户角色
            role: (username == 'admin' ? 'admin' : userRole) as UserRole,
        };
    },
    getters: {
        // 是否为管理员（基于roleId判断）
        isAdmin(): boolean {
            // 优先使用 store 的 role，确保响应式
            return this.role === 'admin';
        },
        // 是否为供应商
        isSupplier(): boolean {
            // 优先使用 store 的 role，确保响应式
            return this.role === 'supplier';
        }
    },
    actions: {
        handleSet(val: string[]) {
            this.key = val;
        },
        // 设置用户角色
        setRole(role: UserRole) {
            this.role = role;
            localStorage.setItem('vuems_role', role);
            console.log('角色已更新:', role);
        },
        // 从 localStorage 重新加载用户角色
        refreshRole() {
            const username = localStorage.getItem('vuems_name');
            const roleId = localStorage.getItem('vuems_roleId');
            
            let userRole: UserRole = 'user';
            if (username === 'admin' || roleId === '1') {
                userRole = 'admin';
            } else if (roleId === '2') {
                userRole = 'supplier';
            }
            
            this.role = userRole;
            console.log('角色已刷新:', userRole);
        },
    },
});
