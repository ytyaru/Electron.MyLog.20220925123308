class AutoPager {
    constructor(setting, scrollElQuery, searchElQuery) {
        console.log(setting, scrollElQuery, searchElQuery)
        this.MODES = ['all', 'search']
        this.mode = 'all' // 'all' or 'search'
        this.pager = {
            'all': new AutoPagerCalc(),
            'search': new AutoPagerCalcSearch(searchElQuery),
        }
        /*
        this.pages = {
            'all': {
                'pager': new AutoPagerCalc(),
                'count': 0,
                'page': -1,
                'limit': 20,
                'offset': 0,
            },
            'search': {
                'pager': new AutoPagerCalcSearch(),
                'count': 0,
                'page': -1,
                'limit': 20,
                'offset': 0,
            }
        }
        this.limit = 20
        this.page = -1
        this.offset = this.limit * this.page
        this.count = 0
        */
        this.setting = setting
        //this.ui = document.querySelector('#post-list')
        this.ui = document.querySelector(scrollElQuery)
        this.timeoutId = 0
        //console.log('AutoPager.count:', this.count, this.offset)
    }
    async changeMode(mode) {
        console.log('AutoPager.changeMode():', mode)
        if (mode === this.mode) { return }
        this.mode = mode
        console.log('AutoPager.changeMode():', 'this.clear()')
        await this.clear()
        this.ui.innerHTML = ''
        //this.ui.innerHTML = ''
    }
    //async setup(scrollElId, searchElId, mode='all') {
    async setup() {
        console.log('AutoPager.setup()')
        this.mode = 'all'
        await this.clear()
        //await this.pager['all'].clear()
        //await this.pager['search'].clear()
        //this.count = await this.pager[this.mode].getCount()
        //this.count = await window.myApi.count()
        this.ui.addEventListener('scroll', async(event) => {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(async()=>{
                if (this.#isFullScrolled(event)) {
                    console.log('scroll event!!:', this.mode)
                    //this.#toHtml(await this.#next())
                    await this.next()
                }
            }, 200);
        })
        this.next()
        //this.#toHtml(await this.#next())
    }
    async next() { this.#toHtml(await this.#next()) }
    async clear(mode=null) {
        if (mode) { await this.pager[mode].clear() }
        else { for await (var m of this.MODES) { await this.pager[m].clear() } }
    }
    #isFullScrolled(event) {
        const adjustmentValue = 60 // ブラウザ設定にもよる。一番下までいかずとも許容する
        const positionWithAdjustmentValue = event.target.clientHeight + event.target.scrollTop + adjustmentValue
        console.log(`isFullScrolled: ${positionWithAdjustmentValue >= event.target.scrollHeight}`)
        return positionWithAdjustmentValue >= event.target.scrollHeight
    }
    async #next() {
        console.log('AutoPager.next(): ', this.mode)
        const next = await this.pager[this.mode].next()
        console.log('next():', next)
        if (next) {
            return await this.pager[this.mode].getPage()
        }
        /*
        if (this.offset < this.count) {
            this.page++;
            this.offset = this.limit * this.page
            console.log(this.limit, this.offset)
            return await this.pager[this.mode].next()
            //return await window.myApi.getPage(this.limit, this.offset)
        } else { return [] }
        */
    }
    #toHtml(records) {
        console.log(records)
        if (records) {
            this.ui.insertAdjacentHTML('beforeend', records.map(r=>TextToHtml.toHtml(r[0], r[1], r[2], this.setting.mona.address)).join(''))
        }
    }
}
