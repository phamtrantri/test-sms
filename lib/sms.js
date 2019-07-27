const _ = require('lodash');
const soap = require('soap');
const { parseString } = require('xml2js');

class SMS {
  constructor({ endpoint, clientNo, clientPass } = {}) {
    this.endpoint = 'http://brand1.aztech.com.vn/ws/agentSmsApiSoap';
    this.authenticate_user = 'ileantestapi';
    this.authenticate_pass = 'ileantestapi@2019';
    this.brand_name = 'AZTECH';
    this.type = 1;
    this.client = null;
  }

  async GetClientBalance() {
    const response = await this.execute('GetClientBalance', {
      clientNo: this.clientNo,
      clientPass: this.clientPass,
      serviceType: 0
    });

    console.log('GetClientBalance > ', response);
    return response;
  }

  /**
   * 
   * @param {*} msg {{senderName, phoneNumber, smsMessage, smsGUID}}
   * @param {*} sendBy 
   */
  async sendSMS(msg, sendBy = 'soap') {
    const baseParam = {
      authenticate_user: this.authenticate_user,
      authenticate_pass: this.authenticate_pass,
      type: 1,
      brand_name: this.brand_name
    };
    if (_.isArray(msg)) {
      return Promise.all(msg.map(m => this.execute('sendSMS', {
        ...baseParam,
        ...m,
      }, sendBy)));
    }
    return this.execute('sendSMS', {
      ...baseParam,
      ...msg,
    }, sendBy);
  }

  async execute(service, params) {
    this.client = await this.createClient();
    if (!this.client) {
      return null;
    }
    const response = await this.client[`${service}Async`](params);
    return new Promise((resolve, reject) => {
      console.log('execute: ', params, ', response: ', response);
      const body = response[`${service}`];
      console.log(body)
      if (/^[\d]+$/.test(body)) {
        return resolve(body);
      }
      parseString(body, (error, data) => {
        if (error) return reject(error);
        resolve(data);
      })
    })
  }

  async createClient() {
    if (!this.client) {
      try {
        return soap.createClientAsync(`${this.endpoint}?wsdl`);
      } catch (error) {
        console.log('[Error] GetClientBalance > ', error);
      }
    }
  }

  toUri(service, query) {
    return `${this.endpoint}/${service}?${query}`;
  }

  buildQuery(params) {
    let query = {};
    if (params) {
      query = {
        ...query,
        ...params,
      }
    }
    return Object.keys(query).map(k => `${k}=${query[k]}`).join('&');
  }
}

module.exports = SMS;
