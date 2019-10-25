const defaultOptions = {
  successText: '导出成功',
  failureText: '导出失败，请重试',
  blobType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export default function download(url, query, options) {
  const axiosOptions = {
    url: `/api${url}?tm=${Date.now()}`,
    method: 'post',
    responseType: 'blob',
    data: query,
  };

  const extraOptions = Object.assign({}, defaultOptions, options);

  return axios(axiosOptions)
    .then((res) => {
      const blob = new Blob([res.data], {
        type: extraOptions.blobType,
      });

      // 解决在微软 Edge 浏览器下无法使用 createObjectURL 生成的 blob 链接下载的问题（https://segmentfault.com/a/1190000017021280）
      if ('msSaveOrOpenBlob' in navigator) {
        window.navigator.msSaveOrOpenBlob(blob, extraOptions.fileName);
      } else {
        const windowUrl = window.URL || window.webkitURL;
        const url = window.URL.createObjectURL(blob);

        // attach blob url to anchor element with download attribute
        const anchor = document.createElement('a');
        anchor.setAttribute('href', url);
        anchor.setAttribute('download', extraOptions.fileName);
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        windowUrl.revokeObjectURL(url);
      }

      Vue.prototype.$message({
        message: extraOptions.successText,
        type: 'success',
        showClose: true,
      });
    })
    .catch(() => {
      Vue.prototype.$message({
        message: extraOptions.failureText,
        type: 'error',
        showClose: true,
      });
    });
}
