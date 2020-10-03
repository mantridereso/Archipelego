<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 15:02
 */

namespace SVB\CBS\ShippingWorldBundle\Model;


interface EngagementInterface extends MessageContentInterface
{

    /**
     * @return ServiceInterface
     */
    public function getServiceOrdered();

    /**
     * @return int
     *
     * price is simple integer value, currency is fictional
     */
    public function getQuotedPriceTotal();

    /**
     * @return int
     */
    public function getQuotedPricePrepayment();

    /**
     * @return ActorInterface
     */
    public function getPrincipal();

    /**
     * @return ActorInterface
     */
    public function getAgent();
}