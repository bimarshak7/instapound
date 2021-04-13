export function cv(pt) {
    const diff = (new Date() - new Date(pt)) * 0.00001666667
    //console.log(diff)
    if (diff <= 1)
        return '1min'
    else if (diff < 60)
        return Math.round(diff) + 'mins'
    else if (diff < 1440) {
        const hr = Math.round(diff / 60)
        const unit = hr > 1 ? 'hrs' : 'hr'
        return hr + unit
    }
    else if (diff < 8640) return Math.round(diff / 1440) + 'd'
    else if (diff < 241920) return Math.round(diff / 10080) + 'w'
    else {
        const yr = Math.round(diff / 525600)
        const unit = yr > 1 ? 'yrs' : 'yr'
        return yr + unit
    }
}   