const axios = require('axios')

class Virtualizor {
    /**
     * Define Virtualizor Instance
     * 
     * @param {string}  api     url virtualizor client panel
     * @param {string}  key     api key virtualizor
     * @param {string}  secret  api password virtualizor
     * @param {boolean} raw     return data with raw or not
     */
    constructor({
        api,
        key,
        secret,
        raw
    }) {
        this.api = api
        this.key = key
        this.secret = secret
        this.raw = raw ? raw : false
    }

    /**
     * Get VPS Details by VPS ID
     * 
     * @param {id}  id  vps id from provider
     * 
     * @returns {json}  return response from rest api with raw or not 
     */
    getvps(id) {
        const buildUrl = `${this.api}/index.php`

        return new Promise((resolve, reject) => {
            axios.get(buildUrl, {
                    params: {
                        act: 'vpsmanage',
                        svs: id,
                        api: 'json',
                        apikey: this.key,
                        apipass: this.secret
                    }
                })
                .then((res) => {
                    return res.data
                })
                .then((res) => {

                    let resData = res

                    if (!this.raw) {
                        resData = {
                            ip: res.info.ip,
                            hostname: res.info.hostname,
                            status: res.info.status,
                            os: res.info.vps.os_name,
                            cores: res.info.vps.cores,
                            ram: res.info.vps.ram,
                            space: res.info.vps.space,
                            bandwidth: {
                                limit: res.info.bandwidth.limit,
                                used: res.info.bandwidth.used,
                                free: res.info.bandwidth.free,
                            },
                            datacenter: res.info.server_name,
                        }
                    }

                    resolve(resData)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}

module.exports = Virtualizor