export const toRupiah = (params, params2) => {
    if(params) {
        return `${params2?params2:"Rp. "}${Number(params).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }else{
        return "Rp. 0"
    }
}