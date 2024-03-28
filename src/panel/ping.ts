import { join } from "path";

export class Ping {
  private test(ip: string, port: number = 7456): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        let timer = null; // 因为最后触发onError导致
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 1) {
            // open 方法已经被调用
          }
          // 下载操作已完成
          if (xhr.readyState === 4) {
            if (xhr.status == 200) {
              if (xhr.responseText) {
                console.warn(ip, xhr.responseText);
                resolve(true);
              }
            } else {
              // 0 出错或者失败
              timer = setTimeout(() => {
                resolve(false);
              }, this.checkTime);
            }
          }
        };

        xhr.onerror = function (event: ProgressEvent) {
          //   console.log(event);
          clearTimeout(timer);
          timer = null;
          resolve(true);
        };
        const url = this.linkUrl(ip, port);
        const full = `http://${ip}:${port}/settings.js`;
        // console.log(full);
        xhr.open("GET", full);
        xhr.timeout = this.timeout;
        xhr.send();
      } catch {
        // console.log(`${ip} failed to connect`);
        resolve(false);
      }
    });
  }
  public timeout: number = 100;
  public checkTime: number = 10;
  private testTimeout(ip: string, port: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 10);
    });
  }
  private linkUrl(ip: string, port: number) {
    return `http://${ip}:${port}`;
  }
  private baseIp: string;
  public checkIp(ip: string) {
    const arr = ip.split(".");
    if (arr.length !== 4) {
      return "ip格式不正确";
    }
    for (let i = 0; i < arr.length; i++) {
      const num = parseInt(arr[i]);
      if (num < 0 || num > 255) {
        return "ip段必须在[0-255]";
      }
    }
    return "";
  }
  public setBaseIp(ip: string) {
    if (4 !== ip.split(".").length) {
      return false;
    } else {
      this.baseIp = ip;
      return true;
    }
  }
  private getFullIp(index: number) {
    const arr = this.baseIp.split(".");
    if (arr.length != 4) {
      return "";
    }
    const ip = [];
    for (let i = 0; i < 3; i++) {
      ip.push(arr[i]);
    }
    ip.push(index);
    return ip.join(".");
  }
  async searchAll(options: { process?: (url: string) => void; find?: (url: string) => void }): Promise<string[]> {
    const ret: string[] = [];
    const ports: number[] = [7456, 7457];
    for (let index = 0; index < ports.length; index++) {
      const port = ports[index];
      for (let i = 1; i < 255; i++) {
        const ip = this.getFullIp(i);
        if (!ip) {
          continue;
        }
        const url = this.linkUrl(ip, port);
        options.process && options.process(url);
        // const b = await this.testTimeout(ip, port);
        const b = await this.test(ip, port);
        if (b) {
          options.find && options.find(url);
          ret.push(url);
        }
      }
    }
    return ret;
  }
  async searchTarget(ip: string = "192.168.1.134", port: number = 7456): Promise<string> {
    const url = this.linkUrl(ip, port);
    const b = await this.test(ip, port);
    if (b) {
      return url;
    }
    return "";
  }
}
