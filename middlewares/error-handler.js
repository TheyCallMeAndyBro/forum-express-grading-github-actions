module.exports = {
  generalErrorHandler (error, req, res, next) {
    if (error instanceof Error) {
      // error.name 為error的錯誤類型  error.message為 throw new Error('Passwords do not match!')中的內容
      req.flash('error_messages', `${error.name}: ${error.message}`)
    } else {
      req.flash('error_messages', `${error}`)
    }
    res.redirect('back') // 'back'導回上一頁

    next(error) // 繼續傳給Express預設的error-handler
  },
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}

// 撰寫error.handler原因為 不要讓整個網站癱掉
