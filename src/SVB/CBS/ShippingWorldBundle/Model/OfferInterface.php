<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 15:00
 */

namespace SVB\CBS\ShippingWorldBundle\Model;


interface OfferInterface extends MessageContentInterface
{

    /**
     * @return ServiceInterface
     */
    public function getServiceOffered();

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

}