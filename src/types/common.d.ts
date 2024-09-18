  /**
   * 公共命名空间声明
   */
  declare module CommonTypes{
    /**
     * 定义一个基本的响应对象接口
     */
    type IResponseBase = {
      /**
       * 状态码
       */
      code?: number 
      /**
       * 响应信息
       */
      msg?: string | string[]

      /**
       * 请求接口路径
       */
      url?: string ,
      error?: any,
      /**
       * 时间戳
       */
      timestamp?: number 
    }
    /**
     * 定义一个基本的分页对象接口
     */
    interface IPageBase {
      /**
       * 页码
       */
      pageIndex?: number 
      /**
       * 当前页条数
       */
      pageSize?: number 
    }
    /**
     * 扩展分页对象接口，包括总条数
     */
    interface IPagenation extends IPageBase {
      /**
       * 总条数
       */
      total?: number 
    }
    /**
     * 响应数据接口，继承自分页对象接口，包含业务数据
     */
    interface IResData<T = any> extends IPageBase {
      /**
       * 业务数据
       */
      data?: T
      /**
       * 总条数
       */
      total?: number 
    }
    /**
     * 全局响应体接口，继承自分页对象、响应基本对象和响应数据接口
     */
    interface IResponse<T> extends IPagenation, IResponseBase {
      /**
       * 业务数据
       */
      data?: T 
    }
    /**
     * 扩展分页对象接口，用于传入查询参数，包含附加属性
     */
    interface IPageIn extends IPageBase {
      [key: string]: any
    }
    /**
     * 定义一个基本的查询对象接口
     */
    interface IQueryBase {
      /**
       * 跳过数量
       */
      skip?: number
      /**
       * 获取数量
       */
      take?: number
    }
    /**
     * 定义一个响应体生成函数类型
     * 
     * @param result - 响应数据
     * @param msg - 消息
     * @param code - 状态码
     * @param url - 路径
     * @returns 返回给前端的响应体
     */
    type TBodyResponse = (result: IResData, msg?: string | string[], code?: number,error?:any, url?: string) => IResponse<IResData<any>>
    
    type Optional<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
  }


