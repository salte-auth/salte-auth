import chai from 'chai';
import chaiString from 'chai-string';
import { Discord } from '../../src/discord';

const { expect } = chai;
chai.use(chaiString);

describe('Discord', () => {
  describe('getter(name)', () => {
    it('should be "discord"', () => {
      const discord = new Discord({
        clientID: '12345',
        responseType: 'token'
      });

      expect(discord.name).to.equal('discord');
    });
  });

  describe('getter(login)', () => {
    it('should construct a login url', () => {
      const discord = new Discord({
        clientID: '12345',
        responseType: 'token'
      });

      const url = new URL(discord.$login());

      expect(`${url.protocol}//${url.hostname}${url.pathname}`).to.equal('https://discordapp.com/api/oauth2/authorize');
      expect(url.searchParams.get('client_id')).to.equal('12345');
      expect(url.searchParams.get('response_type')).to.equal('token');
      expect(url.searchParams.get('redirect_uri')).to.equal(location.origin);
      expect(url.searchParams.get('state')).to.startWith('discord-state-');
    });
  });
});
