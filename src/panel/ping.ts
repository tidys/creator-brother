export class Ping {
  private test(ip: string, port: number = 7456): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
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
              resolve(false);
            }
          }
        };
        const url = this.linkUrl(ip, port);
        xhr.open("GET", url);
        xhr.timeout = 100;
        xhr.send();
      } catch {
        // console.log(`${ip} failed to connect`);
        resolve(false);
      }
    });
  }
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
  async searchAll(options: { process: (url: string) => void; find: (url: string) => void }): Promise<string[]> {
    const ret: string[] = [];
    const ports: number[] = [7456, 7457];
    for (let index = 0; index < ports.length; index++) {
      const port = ports[index];
      for (let i = 0; i < 255; i++) {
        const ip = `192.168.1.${i}`;
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
  async searchTarget(port: number = 7456): Promise<string> {
    const ip = "192.168.1.134";
    const url = this.linkUrl(ip, port);
    const b = await this.test(ip, port);
    if (b) {
      return url;
    }
    return "";
  }
}
