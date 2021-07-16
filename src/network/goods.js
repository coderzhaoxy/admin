import {request} from "../common/request";

export function getCateList(type, pagenum, pagesize) {
  return request({
    url: 'categories',
    params: {
      pagenum,
      pagesize,
      type
    }
  })
}

export function addCate(cat_pid, cat_name, cat_level) {
  return request({
    url: 'categories',
    method: 'post',
    data: {
      cat_pid,
      cat_name,
      cat_level
    }
  })
}

export function editCate(id) {
  return request({
    url: `categories/${id}`,
  })
}

export function newCateInfo(id, cat_name) {
  return request({
    url: `categories/${id}`,
    method: 'put',
    data: {
      cat_name
    }
  })
}

export function removeCateInfo(id) {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}

export function getParamsData(id, sel) {
  return request({
    url: `categories/${id}/attributes`,
    params: {
      sel
    }
  })
}

export function addParams(id, attr_name, attr_sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'post',
    data: {
      attr_name,
      attr_sel,

    }
  })
}


export function showEditDialog(id, attrId, attr_sel) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    params: {
      attr_sel
    }
  })
}

export function editParams(id, attrId, attr_name, attr_sel, attr_vals) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data: {
      attr_name,
      attr_sel,
      attr_vals

    }
  })
}

export function removeParams(id, attrId) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'delete'
  })
}

export function getGoodsList(query, pagenum, pagesize) {
  return request({
    url: 'goods',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

export function getGoodsInfo(id) {
return request({
  url:`goods/${id}`,
})
}

export function editGoodsInfo(goodsInfo) {
  return request({
    url: `goods/${goodsInfo.goods_id}`,
    method: 'put',
    data: {
      goods_name:goodsInfo.goods_name,
      goods_price:goodsInfo.goods_price,
      goods_number:goodsInfo.goods_number,
      goods_weight:goodsInfo.goods_weight,
      goods_cat:goodsInfo.goods_cat
    }
  })
}

export function addGoods(form) {
return request({
  url:'goods',
  method:'post',
  data:{
    goods_name:form.goods_name,
    goods_cat:form.goods_cat,
    goods_price:form.goods_price,
    goods_number:form.goods_number,
    goods_weight:form.goods_weight,
    goods_introduce:form.goods_introduce,
    pics:form.pics,
    attrs:form.attrs,


  }
})
}
