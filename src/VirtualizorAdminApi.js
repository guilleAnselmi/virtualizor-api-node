const axios = require("axios");

class Virtualizor_Admin_API {
  /**
   * Define Virtualizor Instance
   *
   * @param {string}  ip   IP of the NODE
   * @param {string}  key  The API KEY of your NODE
   * @param {string}  pass  The API Password of your NODE
   * @param {int} port (Optional) The port to connect to. Port 4085 is the default. 4084 is non-SSL
   */
  constructor(ip, key, pass, port = 4085) {
    this.ip = ip;
    this.key = key;
    this.pass = pass;
    this.port = port;
    this.protocol = port == 4085 ? "https://" : "http://";
  }

  /**
   * Make an API Key
   *
   * @param  {string} key An 8 bit random string
   * @param  {string} pass The API Password of your NODE
   * @return {string}The new APIKEY which will be used to query
   */
  make_apikey(key, pass) {
    return key + md5(pass + key);
  }

  /**
   * Generates a random string for the given length
   *
   * @param {int} length The length of the random string to be generated
   * @return {string} The generated random string
   */
  generateRandStr(length) {
    let randStr = "";
    for (let i = 0; i < length; i++) {
      const randnum = Math.floor(Math.random() * 62);
      if (randnum < 10) {
        randStr += String.fromCharCode(randnum + 48);
      } else if (randnum < 36) {
        randStr += String.fromCharCode(randnum + 55);
      } else {
        randStr += String.fromCharCode(randnum + 61);
      }
    }
    return randStr.toLowerCase();
  }

  /**
   * Makes an API request to the server to do a particular task
   *
   * @param {string} path The action you want to do
   * @param  {array} post An array of DATA that should be posted
   * @param  {array} cookies An array FOR SENDING COOKIES
   * @return {array} The unserialized array on success OR false on failure
   */
  call(path, data = {}, post = {}, cookies = {}) {
    const apiKey = this.make_apikey(this.generateRandStr(8), this.pass);

    let url = `${this.protocol}://${this.ip}:${this.port}/${path}`;
    url += url.includes("?") ? "" : "?";
    url += `&adminapikey=${encodeURIComponent(
      this.key
    )}&adminapipass=${encodeURIComponent(this.pass)}`;

    url += `&api=serialize&apikey=${encodeURIComponent(apiKey)}`;

    // Pass some data if there
    if (Object.keys(data).length) {
      url += `&apidata=${encodeURIComponent(btoa(JSON.stringify(data)))}`;
    }

    // Set axios parameters.
    const config = {
      method: post ? "post" : "get",
      url,
      timeout: 3000,
      headers: {
        "User-Agent": "Softaculous",
      },
      withCredentials: true,
      data: post,
      params: post ? {} : cookies,
    };

    // Send request to the server.
    return axios(config)
      .then((res) => {
        if (!res.data) {
          return false;
        }

        try {
          return JSON.parse(atob(res.data));
        } catch (err) {
          return false;
        }
      })
      .catch(() => {
        return false;
      });
  }

  addippool(post = {}) {
    post.addippool = 1;
    const path = "index.php?act=addippool";
    return this.call(path, {}, post);
  }

  addips(post = {}) {
    post.submitip = 1;
    const path = "index.php?act=addips";
    return this.call(path, {}, post);
  }

  addiso(post = {}) {
    post.addiso = 1;
    const path = "index.php?act=addiso";
    return this.call(path, {}, post);
  }

  deleteiso(post = {}) {
    const path = "index.php?act=iso";
    return this.call(path, {}, post);
  }

  addplan(post = {}) {
    post.addplan = 1;
    const path = "index.php?act=addplan";
    return this.call(path, {}, post);
  }

  mediagroups(page = 1, reslen = 50, post = {}) {
    if (!Object.keys(post).length) {
      return this.call("index.php?act=mediagroups", {}, post);
    }
    const path = `index.php?act=mediagroups&mgid=${post.mgid}&mg_name=${post.mg_name}&page=${page}&reslen=${reslen}`;
    return this.call(path, {}, post);
  }

  addserver(post = {}) {
    post.addserver = 1;
    const path = "index.php?act=addserver";
    return this.call(path, {}, post);
  }

  servergroups(post = 0) {
    const path = "index.php?act=servergroups";
    return this.call(path, {}, post);
  }

  addtemplate(post = {}) {
    post.addtemplate = 1;
    const path = "index.php?act=addtemplate";
    return this.call(path, {}, post);
  }

  adduser(post = 0) {
    const path = "index.php?act=adduser";
    return this.call(path, {}, post);
  }

  /**
   * Create a VPS
   *
   * @param {object} post An object of DATA that should be posted
   * @param {object} cookies An object FOR SENDING COOKIES
   */
  addvs(post, cookies = {}) {
    const path = "index.php?act=addvs";
    post = this.clean_post(post);
    return this.call(path, {}, post, cookies);
    // return array(
    // 	'title' => $ret['title'],
    // 	'error' => @empty($ret['error']) ? array() : $ret['error'],
    // 	'vs_info' => $ret['newvs'],
    // 	'globals' => $ret['globals']
    // );
  }

  /**
   * Create a VPS (V2 Method)
   *
   * @param {oject} post An oject of DATA that should be posted
   * @param {oject} cookies An oject FOR SENDING COOKIES
   * @return {oject} The unserialized oject on success OR false on failure
   */
  addvs_v2(post, cookies = {}) {
    const path = "index.php?act=addvs";
    post.addvps = 1;
    post.node_select = 1;
    return this.call(path, {}, post, cookies);

    // return array(
    // 	'title' => $ret['title'],
    // 	'error' => @empty($ret['error']) ? array() : $ret['error'],
    // 	'vs_info' => $ret['newvs'],
    // 	'globals' => $ret['globals'],
    // 	'done' => $ret['done']
    // );
  }

  /**
   * Cleaning the POST variables
   *
   * @param {object} post An object of DATA that should be posted
   * @param {object} cookies An object FOR SENDING COOKIES
   * @return {object} The unserialized object on success OR false on failure
   */
  clean_post(post, edit = 0) {
    post = {
      ...post,
      serid: post.serid ? parseInt(post.serid) : 0,
      uid: post.uid ? parseInt(post.uid) : 0,
      plid: post.plid ? parseInt(post.plid) : 0,
      osid: post.osid ? parseInt(post.osid) : 0,
      iso: post.iso ? parseInt(post.iso) : 0,
      space: post.space ? parseInt(post.space) : 10,
      ram: post.ram ? parseInt(post.ram) : 512,
      swapram: post.swapram ? parseInt(post.swapram) : 1024,
      bandwidth: post.bandwidth ? parseInt(post.bandwidth) : 0,
      network_speed: post.network_speed ? parseInt(post.network_speed) : 0,
      cpu: post.cpu ? parseInt(post.cpu) : 1000,
      cores: post.cores ? parseInt(post.cores) : 4,
      cpu_percent: post.cpu_percent ? parseInt(post.cpu_percent) : 100,
      vnc: post.vnc ? parseInt(post.vnc) : 1,
      vncpass: post.vncpass ? post.vncpass : "test",
      sec_iso: post.sec_iso ? post.sec_iso : 0,
      kvm_cache: post.kvm_cache ? post.kvm_cache : 0,
      io_mode: post.io_mode ? post.io_mode : 0,
      vnc_keymap: post.vnc_keymap ? post.vnc_keymap : "en-us",
      nic_type: post.nic_type ? post.nic_type : "default",
      osreinstall_limit: post.osreinstall_limit
        ? parseInt(post.osreinstall_limit)
        : 0,
      mgs: post.mgs ? post.mgs : 0,
      tuntap: post.tuntap ? post.tuntap : 0,
      virtio: post.virtio ? post.virtio : 0,
      noemail: post.noemail ? post.noemail : 0,
      boot: post.boot ? post.boot : "dca",
      band_suspend: post.band_suspend ? post.band_suspend : 0,
      vif_type: post.vif_type ? post.vif_type : "netfront",
    };

    if (post.hvm !== null) {
      post.hvm = post.hvm;
    }

    if (edit == 0) {
      post.addvps = post.addvps ? parseInt(post.addvps) : 1;
    } else {
      post.editvps = post.editvps ? parseInt(post.editvps) : 1;
      post.acpi = post.acpi ? post.acpi : 1;
      post.apic = post.apic ? post.apic : 1;
      post.pae = post.pae ? post.pae : 1;
      post.dns = post.dns ? post.dns : ["4.2.2.1", "4.2.2.2"];
      post.editvps = post.editvps ? post.editvps : 1;
    }
    return post;
  }
}

module.exports = Virtualizor_Admin_API;
