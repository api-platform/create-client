<template>
  <span></span>
</template>

<script>
    export default {
        name: 'ConfirmDelete',
        props: {
            handleDelete: {
                type: Function,
                required: true
            },
            visible: {
                type: Boolean,
                required: true,
                default: () => false
            }
        },
        computed: {
            show: {
                get() {
                    return this.visible;
                },
                set(value) {
                    if (!value) {
                        this.$emit('close');
                    }
                }
            }
        },
        watch: {
            visible(value) {
                if (value && this.handleDelete && window.confirm('Are you sure you want to delete this item?'))
                    this.handleDelete();
                else
                    this.show = false;
            },
        }
    };
</script>
