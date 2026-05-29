import binaryIndexSearch from './binaryIndexSearch';

export default class Computer {
    constructor(minRowHeight, length, height) {
        this.initRowOffSet(minRowHeight, length);
        this.minRowHeight = minRowHeight;
        this.height = height;
        this.length = length;
    }

    initRowOffSet(minRowHeight, length) {
        this.rowData = [];
        for (let index = 0; index < length; index += 1) {
            this.rowData.push({
                offset: index * minRowHeight,
                height: minRowHeight,
                delayHeight: 0,
                delayOffset: 0,
            });
        }
    }

    cacheRowHeight(index, height) {
        if (!this.rowData[index]) return;
        this.rowData[index].height = height;
    }

    updateRowHeightAfterScroll(beginIndex, endIndex) {
        if (!this.rowData.length) return;
        for (let i = 0; i < this.rowData.length; i += 1) {
            if (i === 0) {
                this.rowData[i].offset = 0;
            } else {
                this.rowData[i].offset = this.rowData[i - 1].offset + this.rowData[i - 1].height;
            }
            this.rowData[i].delayHeight = 0;
            this.rowData[i].delayOffset = 0;
        }
    }

    getBeginIndex(scrollTop, preloadBatchSize) {
        const beginIndex = binaryIndexSearch(this.rowData, scrollTop, 1) || 0;
        if (beginIndex >= preloadBatchSize) {
            return beginIndex - preloadBatchSize;
        }
        return 0;
    }

    getEndIndex(scrollTop, preloadBatchSize) {
        const endIndex = binaryIndexSearch(this.rowData, scrollTop + this.height, 2)
        || this.length - 1;
        if (endIndex + preloadBatchSize < this.length) {
            return endIndex + preloadBatchSize;
        }
        return this.length - 1;
    }

    getDisplayData(scrollTop, preloadBatchSize, lastBeginIndex, lastBeforeHeight) {
        const beginIndex = this.getBeginIndex(scrollTop, preloadBatchSize);
        const endIndex = this.getEndIndex(scrollTop, preloadBatchSize);

        if (!this.rowData.length) {
            return {
                beginIndex: 0,
                endIndex: 0,
                beforeHeight: 0,
                afterHeight: 0,
            };
        }

        const beforeHeight = this.rowData[beginIndex].offset;
        const last = this.rowData[this.length - 1];
        const totalHeight = last.offset + last.height;
        const endBottom = this.rowData[endIndex].offset + this.rowData[endIndex].height;
        const visibleHeight = endBottom - beforeHeight;
        let afterHeight = totalHeight - visibleHeight - beforeHeight;
        if (afterHeight < 0) afterHeight = 0;
        return {
            beginIndex,
            endIndex,
            beforeHeight,
            afterHeight,
        };
    }
}

