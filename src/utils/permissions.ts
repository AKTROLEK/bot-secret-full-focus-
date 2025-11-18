import { GuildMember } from 'discord.js';
import { config } from '../config/config';

export const hasPermission = (member: GuildMember, requiredRoles: string[]): boolean => {
  return requiredRoles.some(roleId => member.roles.cache.has(roleId));
};

export const isStaff = (member: GuildMember): boolean => {
  return hasPermission(member, [
    config.roles.socialMediaManager,
    config.roles.socialTeam,
    config.roles.streamerManagement,
  ]);
};

export const isStreamer = (member: GuildMember): boolean => {
  return member.roles.cache.has(config.roles.streamer);
};

export const canManageTickets = (member: GuildMember): boolean => {
  return hasPermission(member, [
    config.roles.socialMediaManager,
    config.roles.socialTeam,
    config.roles.streamerManagement,
  ]);
};
