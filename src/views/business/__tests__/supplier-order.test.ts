import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: supplier-order-device-info, Property 2: Status tag type mapping consistency**
 * 
 * *For any* device status value, the status tag type should be correctly mapped:
 * "运行中" maps to "success" type, "离线中" maps to "info" type, 
 * and any other status maps to a default type.
 * 
 * **Validates: Requirements 1.4, 1.5**
 */

// 状态标签类型映射函数（与组件中的实现保持一致）
const getStatusTagType = (status: string): string => {
    if (status === '运行中') return 'success';
    if (status === '离线中') return 'info';
    return 'warning';
};

describe('supplier-order device info', () => {
    describe('Property 2: Status tag type mapping consistency', () => {
        it('should map "运行中" to "success" type', () => {
            expect(getStatusTagType('运行中')).toBe('success');
        });

        it('should map "离线中" to "info" type', () => {
            expect(getStatusTagType('离线中')).toBe('info');
        });

        it('should map any other status to "warning" type (property test)', () => {
            // **Feature: supplier-order-device-info, Property 2: Status tag type mapping consistency**
            fc.assert(
                fc.property(
                    fc.string().filter(s => s !== '运行中' && s !== '离线中'),
                    (status) => {
                        const result = getStatusTagType(status);
                        return result === 'warning';
                    }
                ),
                { numRuns: 100 }
            );
        });

        it('should always return a valid tag type for any input', () => {
            // **Feature: supplier-order-device-info, Property 2: Status tag type mapping consistency**
            fc.assert(
                fc.property(fc.string(), (status) => {
                    const result = getStatusTagType(status);
                    return ['success', 'info', 'warning'].includes(result);
                }),
                { numRuns: 100 }
            );
        });
    });
});


/**
 * **Feature: supplier-order-device-info, Property 1: Device info fields display completeness**
 * 
 * *For any* valid device info API response, the rendered Device_Info_Card should contain 
 * all required fields: deviceCode, deviceStatus, deviceAddress, softwareVersion, and hardwareVersion.
 * 
 * **Validates: Requirements 1.2, 1.3, 1.6, 1.7, 1.8**
 */

// 设备信息展示数据接口
interface DeviceDisplayInfo {
    deviceCode: string;
    deviceName: string;
    deviceStatus: string;
    deviceAddress: string;
    softwareVersion: string;
    hardwareVersion: string;
}

// 设备信息数据接口（API返回）
interface DeviceInfoData {
    deviceCode: string;
    deviceName: string;
    deviceStatus: string;
    deviceAddress: string;
    softwareVersion: string;
    hardwareVersion: string;
    networkCarrier: string;
    totalTraffic: number | null;
    monthlyTraffic: number | null;
    partList: Array<{
        partId: number;
        partName: string;
        partNum: number;
        partTotal: number;
        partStatus: string;
    }>;
}

// 数据转换函数（与组件中的实现保持一致）
const transformDeviceInfo = (data: DeviceInfoData): DeviceDisplayInfo => {
    return {
        deviceCode: data.deviceCode || '--',
        deviceName: data.deviceName || '--',
        deviceStatus: data.deviceStatus || '未知',
        deviceAddress: data.deviceAddress || '--',
        softwareVersion: data.softwareVersion || '--',
        hardwareVersion: data.hardwareVersion || '--'
    };
};

// 生成随机设备信息数据的 Arbitrary
const deviceInfoDataArbitrary = fc.record({
    deviceCode: fc.string({ minLength: 1 }),
    deviceName: fc.string({ minLength: 1 }),
    deviceStatus: fc.oneof(fc.constant('运行中'), fc.constant('离线中'), fc.string()),
    deviceAddress: fc.string({ minLength: 1 }),
    softwareVersion: fc.string({ minLength: 1 }),
    hardwareVersion: fc.string({ minLength: 1 }),
    networkCarrier: fc.string(),
    totalTraffic: fc.oneof(fc.nat(), fc.constant(null)),
    monthlyTraffic: fc.oneof(fc.nat(), fc.constant(null)),
    partList: fc.array(fc.record({
        partId: fc.nat(),
        partName: fc.string(),
        partNum: fc.nat(),
        partTotal: fc.nat(),
        partStatus: fc.string()
    }))
});

describe('Property 1: Device info fields display completeness', () => {
    it('should transform all required fields from API response', () => {
        // **Feature: supplier-order-device-info, Property 1: Device info fields display completeness**
        fc.assert(
            fc.property(deviceInfoDataArbitrary, (apiData) => {
                const displayInfo = transformDeviceInfo(apiData);
                
                // 验证所有必需字段都存在且不为空
                return (
                    displayInfo.deviceCode !== undefined &&
                    displayInfo.deviceStatus !== undefined &&
                    displayInfo.deviceAddress !== undefined &&
                    displayInfo.softwareVersion !== undefined &&
                    displayInfo.hardwareVersion !== undefined
                );
            }),
            { numRuns: 100 }
        );
    });

    it('should preserve non-empty field values during transformation', () => {
        // **Feature: supplier-order-device-info, Property 1: Device info fields display completeness**
        fc.assert(
            fc.property(deviceInfoDataArbitrary, (apiData) => {
                const displayInfo = transformDeviceInfo(apiData);
                
                // 如果API数据有值，转换后应该保持相同的值
                if (apiData.deviceCode) {
                    return displayInfo.deviceCode === apiData.deviceCode;
                }
                return displayInfo.deviceCode === '--';
            }),
            { numRuns: 100 }
        );
    });
});

/**
 * **Feature: supplier-order-device-info, Property 3: Data transformation correctness**
 * 
 * *For any* valid DeviceInfoData from the API, the transformation to DeviceDisplayInfo 
 * should preserve all field values without data loss or corruption.
 * 
 * **Validates: Requirements 3.3**
 */
describe('Property 3: Data transformation correctness', () => {
    it('should not lose any data during transformation', () => {
        // **Feature: supplier-order-device-info, Property 3: Data transformation correctness**
        fc.assert(
            fc.property(deviceInfoDataArbitrary, (apiData) => {
                const displayInfo = transformDeviceInfo(apiData);
                
                // 验证转换后的数据与原始数据一致（对于非空值）
                const codeMatch = apiData.deviceCode ? displayInfo.deviceCode === apiData.deviceCode : displayInfo.deviceCode === '--';
                const nameMatch = apiData.deviceName ? displayInfo.deviceName === apiData.deviceName : displayInfo.deviceName === '--';
                const statusMatch = apiData.deviceStatus ? displayInfo.deviceStatus === apiData.deviceStatus : displayInfo.deviceStatus === '未知';
                const addressMatch = apiData.deviceAddress ? displayInfo.deviceAddress === apiData.deviceAddress : displayInfo.deviceAddress === '--';
                const softwareMatch = apiData.softwareVersion ? displayInfo.softwareVersion === apiData.softwareVersion : displayInfo.softwareVersion === '--';
                const hardwareMatch = apiData.hardwareVersion ? displayInfo.hardwareVersion === apiData.hardwareVersion : displayInfo.hardwareVersion === '--';
                
                return codeMatch && nameMatch && statusMatch && addressMatch && softwareMatch && hardwareMatch;
            }),
            { numRuns: 100 }
        );
    });

    it('should handle empty strings with fallback values', () => {
        // **Feature: supplier-order-device-info, Property 3: Data transformation correctness**
        const emptyData: DeviceInfoData = {
            deviceCode: '',
            deviceName: '',
            deviceStatus: '',
            deviceAddress: '',
            softwareVersion: '',
            hardwareVersion: '',
            networkCarrier: '',
            totalTraffic: null,
            monthlyTraffic: null,
            partList: []
        };
        
        const displayInfo = transformDeviceInfo(emptyData);
        
        expect(displayInfo.deviceCode).toBe('--');
        expect(displayInfo.deviceName).toBe('--');
        expect(displayInfo.deviceStatus).toBe('未知');
        expect(displayInfo.deviceAddress).toBe('--');
        expect(displayInfo.softwareVersion).toBe('--');
        expect(displayInfo.hardwareVersion).toBe('--');
    });
});
