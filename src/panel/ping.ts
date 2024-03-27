function test(ip) {
  try {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
      }
      console.warn(ip, xhr.responseText);
    };
    xhr.open("GET", `http://${ip}:7456`);
    xhr.send();
  } catch {
    console.log(`${ip} failed to connect`);
  }
}
for (let i = 0; i < 255; i++) {
  const ip = `192.168.1.${i}`;
  // test(ip);
}
test("192.168.1.134")