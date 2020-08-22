import { b } from '../b';

const { c } = require('../c');

require.resolve('../d');

const e = () => import('../e');

b();
c();
