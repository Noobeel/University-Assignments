import { useWindowSize } from 'rooks';
import { HEADER_HEIGHT } from './constants';
import { convertPXToVH } from './functions';

export const usePageHeight = () => {
    const { innerHeight } = useWindowSize();

    return `${100 - convertPXToVH(HEADER_HEIGHT, innerHeight ?? 0)}vh`;
};
