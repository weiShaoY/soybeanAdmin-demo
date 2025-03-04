// / <reference types="@amap/amap-jsapi-types" />
// / <reference types="bmapgl" />

declare namespace BMap {
  class Map extends BMapGL.Map {}
  class Point extends BMapGL.Point {}
}

declare const TMap: any
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Window = {

  /**
   * 使用 https 协议进行百度地图请求
   *
   * - 0: http
   * - 1: https
   * - 2: https
   */
  HOST_TYPE: '0' | '1' | '2'
}
