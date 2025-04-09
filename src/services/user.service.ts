import { BotUserRepository } from '../database/repositories/botUser.repository';
import { UserRepository } from '../database/repositories/user.repository';

export class UserServices {
  static async isRegistered(id: string) {
    console.log({ id });
    const User = await BotUserRepository.findOneBy({ discord_id: id });
    return User;
  }
  static async CreateOrUpdate(payload: { id: string; discord_id: string }) {
    const User = await UserRepository.findOneByOrFail({ id: payload.id });

    const botUser = await BotUserRepository.findOneBy({
      discord_id: payload.discord_id,
    });
    if (botUser) {
      botUser.discord_id = payload.discord_id;
      await BotUserRepository.save(botUser);
      return botUser;
    }

    const newBotUser = BotUserRepository.create({
      discord_id: payload.discord_id,
      owner: User.id,
    });
    return await BotUserRepository.save(newBotUser);
  }

  //   static async findOne(options: FindOneOptions<UserEntity>['where']) {
  //     return await BotUserRepository.findOneOrFail({
  //       where: options,
  //     });
  //   }
  //   static async update(payload: UserEntity) {
  //     const User = await BotUserRepository.findOneByOrFail({
  //       UserId: payload.UserId,
  //     });
  //     BotUserRepository.merge(User, payload);
  //     return await BotUserRepository.save(User);
  //   }
}
