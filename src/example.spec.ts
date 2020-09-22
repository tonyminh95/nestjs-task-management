import { initialize } from "passport";

// feature
class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        global.console.log(`"${name}" is now a friend!`);
    }

    removeFriend(name) {
        const index = this.friends.indexOf(name);

        if (index === -1) {
            throw new Error('Friend not found!');
        }

        this.friends.splice(index, 1);
    }
}

// test
describe('FriendList', () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    });

    it('initialize friends list', () => {
        expect(friendsList.friends.length).toEqual(0);
    });

    it('adds a friend to the list', () => {
        friendsList.addFriend('Minh');

        expect(friendsList.friends.length).toEqual(1);
    });

    it('announces friendship', () => {
        friendsList.announceFriendship = jest.fn();

        expect(friendsList.announceFriendship).not.toHaveBeenCalled();

        friendsList.addFriend('Minh');

        expect(friendsList.announceFriendship).toHaveBeenCalledWith('Minh');
    });

    describe('removeFriend', () => {
        it('removes a friend from the list', () => {
            friendsList.addFriend('Minh');

            expect(friendsList.friends[0]).toEqual('Minh');

            friendsList.removeFriend('Minh');

            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('throws an error as friend does not exist', () => {
            expect(() => friendsList.removeFriend('Minh')).toThrow(Error);
        });
    });
});