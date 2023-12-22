<script setup lang="ts">
import { TextareaField } from '@vue-interface/textarea-field';
import { ref, watchEffect } from 'vue';
import { lint } from '../src/index';

const document = ref<string>(`
<p><a href="https://a.com/?a=1&amp;b=2&amp;b=2">test</a></p>
`);

const errors = ref<any[]>();

watchEffect(() => {
    errors.value = document.value ? lint(document.value) : [];
});
</script>

<template>
    <div class="p-8">
        <TextareaField v-model="document" :autogrow="false" />
        <div v-if="errors?.length" class="mt-4 p-4 rounded bg-rose-500 text-rose-100">
            <div v-for="error in errors">
                {{ error.message }} on line {{ error.line }} column {{ error.col}}
            </div>
        </div>
    </div>
</template>