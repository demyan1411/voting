import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  describe('setEntries', () => {

    it('преобразует в immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(fromJS({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

  });

  describe('next', () => {

    it('берёт для голосования следующие две записи', () => {
      const state = fromJS({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });
      const nextState = next(state);

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: List.of('Trainspotting', '28 Days Later')
        },
        entries: List.of('Sunshine')
      }));
    });

    it('помещает победителя текущего голосования в конец списка записей', () => {
      const state = fromJS({
        vote: {
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: {
            'Trainspotting': 4,
            '28 Days Later': 2
          }
        },
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: List.of('Sunshine', 'Millions')
        },
        entries: List.of('127 Hours', 'Trainspotting')
      }));
    });

    it('в случае ничьей помещает обе записи в конец списка', () => {
      const state = fromJS({
        vote: {
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: {
            'Trainspotting': 3,
            '28 Days Later': 3
          }
        },
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);

      expect(nextState).to.equal(fromJS({
        vote: {
          pair: List.of('Sunshine', 'Millions')
        },
        entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
      }));
    });

    it('когда остаётся лишь одна запись, помечает её как победителя', () => {
      const state = fromJS({
        vote: {
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: {
            'Trainspotting': 4,
            '28 Days Later': 2
          }
        },
        entries: List()
      });
      const nextState = next(state);

      expect(nextState).to.equal(fromJS({
        winner: 'Trainspotting'
      }));
    });

  });

  describe('vote', () => {

    it('создаёт результат голосования для выбранной записи', () => {
      const state = fromJS({
        pair: List.of('Trainspotting', '28 Days Later')
      })
      const nextState = vote(state, 'Trainspotting');

      expect(nextState).to.equal(fromJS({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: {
          'Trainspotting': 1
        }
      }));
    });

    it('добавляет в уже имеющийся результат для выбранной записи', () => {
      const state = fromJS({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: {
          'Trainspotting': 3,
          '28 Days Later': 2
        }
      });
      const nextState = vote(state, 'Trainspotting');

      expect(nextState).to.equal(fromJS({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: {
          'Trainspotting': 4,
          '28 Days Later': 2
        }
      }));
    });

     it('ignores the vote if for an invalid entry', () => {
      expect(
        vote(Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }), 'Sunshine')
      ).to.equal(
        Map({
          pair: List.of('Trainspotting', '28 Days Later')
        })
      );
    });

  });
});
