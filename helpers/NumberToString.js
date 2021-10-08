export const toRupiah = (params, params2) => {
    return `${params2}${Number(params).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}