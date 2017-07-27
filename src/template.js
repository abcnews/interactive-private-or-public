module.exports = `<div id="app" v-cloak>
    <div class="arguments">
        <div v-for="html in args" v-html="html">
        </div>
    </div>
    <div v-if="canChoose">
        <div class="choices">
            <div class="changed-mind">
                {{ changedMind }}
            </div>
            <div v-on:click="updateChoice('privateSchool')" class="choice choose-private">
                <div class="text">
                    I'm {{ privateVerb }} Private School
                </div>
                <div class="stick"></div>
            </div>
            <div v-on:click="updateChoice('publicSchool')" class="choice choose-public">
                <div class="text">
                    I'm {{ publicVerb }} Public School
                </div>
                <div class="stick"></div>
            </div>
        </div>
        <div class="face">
            <img v-if="face === 'smug'" src="face-smug.png" />
            <img v-if="face === 'thinking'" src="face-thinking.png" />
            <img v-if="face === 'startled'" src="face-startled.png" />
            <img v-if="face === 'alarmed'" src="face-alarmed.png" />
        </div>
    </div>
    <div v-if="!canChoose">
        <div class="summary">
            <div v-html="summary"></div>
        
            <div class="choices">
                <div v-on:click.stop="reset" class="choice choose-reset">
                    <div class="text">
                        I want to start again
                    </div>
                    <div class="stick"></div>
                </div>
                <div class="face">
                    <img src="face-alarmed.png" />
                </div>
            </div>
        </div>
    </div>
</div>`;
