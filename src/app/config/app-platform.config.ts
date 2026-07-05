export type AppDistributionPlatform = 'ios' | 'android' | 'mobileweb';

export interface AppPlatformConfig {
  platform: AppDistributionPlatform;
  appName: string;
  appId: string;
  distributionTarget: string;
  apiBaseUrl: string;
  requiredPermissions: string[];
}

export const APP_PLATFORM_CONFIGS: Record<AppDistributionPlatform, AppPlatformConfig> = {
  ios: {
    platform: 'ios',
    appName: 'SkeletonAPP',
    appId: 'cl.pgy4221.skeletonapp',
    distributionTarget: 'App Store Connect',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    requiredPermissions: ['Camera', 'LocationWhenInUse']
  },
  android: {
    platform: 'android',
    appName: 'SkeletonAPP',
    appId: 'cl.pgy4221.skeletonapp',
    distributionTarget: 'Google Play Console',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    requiredPermissions: ['CAMERA', 'ACCESS_FINE_LOCATION', 'INTERNET']
  },
  mobileweb: {
    platform: 'mobileweb',
    appName: 'SkeletonAPP',
    appId: 'cl.pgy4221.skeletonapp.web',
    distributionTarget: 'Web deploy',
    apiBaseUrl: 'https://jsonplaceholder.typicode.com',
    requiredPermissions: ['Browser storage', 'Geolocation API']
  }
};

export function getDefaultPlatformConfig(
  platform: AppDistributionPlatform = 'android'
): AppPlatformConfig {
  return APP_PLATFORM_CONFIGS[platform];
}
