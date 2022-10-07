// 把所有自定义指令的具体操作都存放到这里
// 当图片路径存在但是加载不出来的时候就需要这个自定义指令
export const imgerror = {
  // 当出错的时候替换图片
  // 插入的指令的时候
  inserted(el, binding, vnode) {
    // el 插入的dom元素
    // console.log(el)
    // binding 绑定的具体信息
    // console.log(binding)
    // vnode虚拟节点
    // console.log(vnode)
    // 当触发所绑定元素的错误事件时（相当于是图片找不到）
    el.onerror = function() {
      el.src = binding.value
    }
  }
}
