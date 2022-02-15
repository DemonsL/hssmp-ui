<style scoped>
    .expand-row{ margin-bottom: 16px;  }
    .icon-dev-value{background:url(../../../assets/images/ico_table.png) no-repeat 0 -30px;display: inline-block; padding-left:30px;l}
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="icon-dev-value">{{ row.job }}</span>
            </Col>
            <Col span="6">
                <span class="expand-value">{{ row.interest }}</span>
            </Col>
            <Col span="6">
                <span class="expand-value">{{ row.birthday }}</span>
            </Col>
            <Col span="6">
                <span class="expand-value">{{ row.birthday }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>
