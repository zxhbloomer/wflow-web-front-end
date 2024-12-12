/**
 * 图片转base64并压缩指定大小
 * @param self
 * @param size
 */
export function imgFileZip(self, size, call) {
  //创建一个读取文件的对象
  let reader = new FileReader();
  //读取文件，转码
  reader.readAsDataURL(self.files[0]);
  reader.onload = function (e) {
    let base64 = e.target.result; //转码过后的base64编码
    console.log("压缩前", base64.length / 1024 + 'KB');
    //创建一个图片
    let newImage = new Image();
    let quality = 0.6;    //压缩系数0-1之间，压缩到0.9以上会有bug，注意！（可以自行设置）
    newImage.src = base64;
    newImage.setAttribute("crossOrigin", 'Anonymous');	//url为外域时需要
    let imgWidth, imgHeight;
    newImage.onload = function () {
      imgWidth = this.width;
      imgHeight = this.height;
      //给生成图片设置一个默认的宽度（可以自行设置）
      let myWidth = 50;
      //准备在画布上绘制图片
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //判断上传的图片的宽高是否超过设置的默认宽度以及设置同比例的高
      if (Math.max(imgWidth, imgHeight) > myWidth) {
        if (imgWidth > imgHeight) {
          canvas.width = myWidth;
          canvas.height = myWidth * imgHeight / imgWidth;
        } else {
          canvas.height = myWidth;
          canvas.width = myWidth * imgWidth / imgHeight;
        }
      } else {
        canvas.width = imgWidth;
        canvas.height = imgHeight;
      }
      //清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //开始绘制图片到画布上
      ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
      let newBase64 = canvas.toDataURL("image/jpeg", quality);//压缩图片大小（重点代码）
      // 获取到当前的图片的大小，然后调整成自己需要的大小，例如说需要200KB-500KB之间（可以自行设置）
      while (newBase64.length > 1024 * size && quality > 0) {
        quality -= 0.02;
        newBase64 = canvas.toDataURL("image/jpeg", quality);
      }
      call(newBase64);
      console.log("压缩后", newBase64.length / 1024 + 'KB')
    }
  };

}

export function imgZip(path, obj, callback) {
  var img = new Image();
  img.src = path;
  img.onload = function () {
    var that = this;
    // 默认按比例压缩
    var w = that.width, h = that.height, scale = w / h;
    w = (obj.width || w) / 3;
    h = (obj.height || (w / scale)) / 3;
    var quality = 0.6; // 默认图片质量为0.7
    // 生成canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    // 创建属性节点
    var anw = document.createAttribute("width");
    anw.nodeValue = w;
    var anh = document.createAttribute("height");
    anh.nodeValue = h;
    canvas.setAttributeNode(anw);
    canvas.setAttributeNode(anh);
    ctx.drawImage(that, 0, 0, w, h);
    // 图像质量
    if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
      quality = obj.quality;
    }
    // quality值越小，所绘制出的图像越模糊
    var base64 = canvas.toDataURL('image/jpeg', quality);
    // 回调函数返回base64的值
    callback(base64);
  }
}

export default {
  imgFileZip, imgZip
}
