export const toRupiah = (params, params2) => {
    if(params) {
        return `${params2}${Number(params).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }else{
        return ""
    }
}