import { CommonService } from './common.service';

describe('CommonService', () => {
    let service: CommonService;

    beforeAll(() => {
        service = new CommonService();
    });

    describe('combineDiffBeforeAfter', () => {
        it('should return only changed fields excluding timestamps', () => {
            const before = {
                name: 'ali',
                age: 20,
                createdAt: 'x',
                updatedAt: 'y',
            };

            const after = {
                name: 'ali reza',
                age: 20,
                createdAt: 'x2',
                updatedAt: 'y2',
            };

            const result = service.combineDiffBeforeAfter(before, after);

            expect(result).toEqual({
                changesBefore: { name: 'ali' },
                changesAfter: { name: 'ali reza' },
            });
        });

        it('should return empty objects if nothing changed', () => {
            const before = { name: 'ali' };
            const after = { name: 'ali' };

            const result = service.combineDiffBeforeAfter(before, after);

            expect(result).toEqual({
                changesBefore: {},
                changesAfter: {},
            });
        });
    });

    describe('findModuleByFAName', () => {
        it('should return correct module for partial Persian match', () => {
            const result = service.findModuleByFAName('کار');

            expect(result).toContain('cart');
            expect(result).toContain('user');
        });

        it('should return empty array if no match found', () => {
            const result = service.findModuleByFAName('xyz');

            expect(result).toEqual([]);
        });

        it('should match exact Persian key', () => {
            const result = service.findModuleByFAName('محصول');

            expect(result).toContain('products');
        });
    });
});
