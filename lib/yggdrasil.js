/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var superagent = require("superagent");

var loginSrv = "https://authserver.mojang.com";

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

function getSession(username, password, clientToken, refresh, cb) {
  if (refresh) {
    var accessToken = password;
    superagent.post(loginSrv + "/refresh")
      .type("json")
      .send({
        "accessToken": accessToken,
        "clientToken": clientToken
      })
      .end(function (resp) {
        if (resp.ok) {
          var session = {
            accessToken: resp.body.accessToken,
            clientToken: resp.body.clientToken,
            username: resp.body.selectedProfile.name
          };
          cb(null, session);
        } else {
          var myErr = new Error(resp.body.error);
          myErr.errorMessage = resp.body.errorMessage;
          myErr.cause = resp.body.cause;
          cb(myErr);
        }
      });
  } else {
    superagent.post(loginSrv + "/authenticate")
      .type("json")
      .send({
        "agent": {
          "name": "Minecraft",
          "version": 1
        },
        "username": username,
        "password": password,
        "clientToken": clientToken
      })
      .end(function (resp) {
        if (resp.ok) {
          var session = {
            accessToken: resp.body.accessToken,
            clientToken: resp.body.clientToken,
            username: resp.body.selectedProfile.name
          }
          cb(null, session);
        } else {
          var myErr = new Error(resp.body.error);
          myErr.errorMessage = resp.body.errorMessage;
          myErr.cause = resp.body.cause;
          cb(myErr);
        }
      });
  }
}

function joinServer(username, serverId, accessToken, cb) {
  superagent.post("https://sessionserver.mojang.com/session/minecraft/join")
    .type("json")
    .send({
      "accessToken": accessToken,
      "selectedProfile": "lol",
      "serverId": serverId
    })
    .end(function(resp) {
      if (resp.ok) {
        cb(null);
      } else {
        cb(new Error("Minecraft auth failed"));
      }
    });
}

function validateSession(username, serverId, cb) {
  superagent.get("https://sessionserver.mojang.com/session/minecraft/hasJoined?username=" + username + "&serverId=" + serverId)
    .end(function(resp) {
      if (resp.ok) {
        cb(null, resp.body.id);
      } else {
        cb(new Error("Couldn't auth player"));
      }
    });
}

exports.getSession = getSession;
exports.joinServer = joinServer;
exports.validateSession = validateSession;
exports.generateUUID = generateUUID;
exports.loginType = "yggdrasil";